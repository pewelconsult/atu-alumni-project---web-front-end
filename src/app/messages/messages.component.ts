import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { User } from '../../models/user';
import { Conversation, Message } from '../../models/message';
import { MessagingService } from '../../services/messaging.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  private typingTimeout: any;
  private lastMessageCount = 0; // ✅ Track message count

  // User data
  currentUser: User | null = null;
  
  // Conversations
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  
  // Messages
  messages: Message[] = [];
  newMessage: string = '';
  
  // Search
  searchQuery: string = '';
  
  // Loading states
  isLoadingConversations: boolean = false;
  isLoadingMessages: boolean = false;
  isSendingMessage: boolean = false;
  isInitialLoad: boolean = true; // ✅ Track initial load
  
  // Typing indicator
  isOtherUserTyping: boolean = false;
  otherUserTypingName: string = '';

  constructor(
    private messageService: MessagingService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  // Get current user
  this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
    this.currentUser = user;
    if (user) {
      // First load conversations
      this.loadConversations();
    }
  });

  // ✅ Check URL params AFTER conversations are loaded
  this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
    if (params['user'] && this.currentUser) {
      const otherUserId = parseInt(params['user']);
      console.log('URL param user detected:', otherUserId);
      
      // ✅ Small delay to ensure conversations are loaded first
      setTimeout(() => {
        this.createOrOpenConversation(otherUserId);
      }, 500);
    }
  });

  // Only poll if conversation is selected and after initial load
  timer(10000, 10000)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      if (this.selectedConversation && this.currentUser && !this.isInitialLoad) {
        this.refreshMessagesQuietly();
      }
    });
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  /**
   * ✅ Create or open conversation with a specific user
   */
  /**
 * ✅ Create or open conversation with a specific user
 */
  /**
 * ✅ Create or open conversation with a specific user
 */
createOrOpenConversation(otherUserId: number): void {
  if (!this.currentUser) return;

  console.log('Creating/opening conversation with user:', otherUserId);

  // Check if conversation already exists
  const existingConv = this.conversations.find(c => c.other_user_id === otherUserId);
  
  if (existingConv) {
    console.log('Found existing conversation:', existingConv);
    this.selectConversation(existingConv);
  } else {
    // Create new conversation
    this.messageService.getOrCreateConversationWithUser(this.currentUser.id, otherUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Create conversation response:', response);
          
          if (response.success && response.data) {
            const rawConv = response.data;
            
            // ✅ Determine which user is "other" and map properties correctly
            const isUser1 = rawConv.user1_id === this.currentUser?.id;
            const otherUserId = isUser1 ? rawConv.user2_id : rawConv.user1_id;
            const otherUserName = isUser1 ? rawConv.user2_name : rawConv.user1_name;
            const otherUserPicture = isUser1 ? rawConv.user2_picture : rawConv.user1_picture;
            
            // ✅ Transform backend response to match our Conversation interface
            const conversation: Conversation = {
              conversation_id: rawConv.id, // ✅ Backend returns 'id', not 'conversation_id'
              other_user_id: otherUserId,
              other_user_name: otherUserName || 'User',
              other_user_picture: otherUserPicture,
              unread_count: 0,
              is_archived: rawConv.is_archived_by_user1 || rawConv.is_archived_by_user2 || false,
              is_blocked: rawConv.is_blocked_by_user1 || rawConv.is_blocked_by_user2 || false,
              last_message_at: rawConv.last_message_at || rawConv.created_at || new Date().toISOString(),
              last_message_preview: rawConv.last_message_preview || '',
              conversation_created_at: rawConv.created_at || new Date().toISOString()
            };
            
            console.log('Transformed conversation:', conversation);
            
            // Add to conversations list if not already there
            if (!this.conversations.find(c => c.conversation_id === conversation.conversation_id)) {
              this.conversations.unshift(conversation);
            }
            
            // ✅ Select the conversation immediately
            this.selectConversation(conversation);
          } else {
            console.error('Invalid response structure:', response);
            alert('Failed to start conversation. Invalid response.');
          }
        },
        error: (error) => {
          console.error('Error creating conversation:', error);
          alert('Failed to start conversation. Please try again.');
        }
      });
  }
}


  /**
   * Load all conversations
   */
  loadConversations(): void {
    if (!this.currentUser) return;

    this.isLoadingConversations = true;
    this.messageService.getUserConversations(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.conversations = response.data;
          }
          this.isLoadingConversations = false;
        },
        error: (error) => {
          console.error('Error loading conversations:', error);
          this.isLoadingConversations = false;
        }
      });
  }

  /**
   * Select a conversation
   */
  selectConversation(conversation: Conversation): void {
    this.isInitialLoad = true; // ✅ Set initial load flag
    this.selectedConversation = conversation;
    this.loadMessages(conversation.conversation_id);
    this.markAsRead(conversation.conversation_id);
  }

  /**
   * Load messages for selected conversation
   */
  loadMessages(conversationId: number): void {
    if (!this.currentUser) return;

    this.isLoadingMessages = true;
    this.messageService.getConversationMessages(conversationId, this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.messages = response.data;
            this.lastMessageCount = this.messages.length; // ✅ Store count
            setTimeout(() => {
              this.scrollToBottom();
              this.isInitialLoad = false; // ✅ Initial load complete
            }, 100);
          }
          this.isLoadingMessages = false;
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.isLoadingMessages = false;
          this.isInitialLoad = false;
        }
      });
  }

  /**
   * ✅ Refresh messages quietly (no loading indicator, no scroll unless new messages)
   */
  refreshMessagesQuietly(): void {
    if (!this.currentUser || !this.selectedConversation) return;

    this.messageService.getConversationMessages(
      this.selectedConversation.conversation_id,
      this.currentUser.id
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const newMessages = response.data;
          
          // ✅ Only update if there are new messages
          if (newMessages.length > this.lastMessageCount) {
            this.messages = newMessages;
            this.lastMessageCount = newMessages.length;
            setTimeout(() => this.scrollToBottom(), 100);
          }
        }
      },
      error: (error) => console.error('Error refreshing messages:', error)
    });
  }

  /**
   * Send a message
   */
  sendMessage(): void {
    if (!this.currentUser || !this.selectedConversation || !this.newMessage.trim()) {
      return;
    }

    this.isSendingMessage = true;

    const messageData = {
      conversation_id: this.selectedConversation.conversation_id,
      sender_id: this.currentUser.id,
      message_text: this.newMessage.trim()
    };

    this.messageService.sendMessage(messageData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.messages.push(response.data);
            this.lastMessageCount = this.messages.length; // ✅ Update count
            this.newMessage = '';
            setTimeout(() => this.scrollToBottom(), 100);
            
            // ✅ Quietly update conversation list
            this.loadConversationsQuietly();
          }
          this.isSendingMessage = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          alert('Failed to send message');
          this.isSendingMessage = false;
        }
      });
  }

  /**
   * ✅ Load conversations quietly (no loading indicator)
   */
  loadConversationsQuietly(): void {
    if (!this.currentUser) return;

    this.messageService.getUserConversations(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.conversations = response.data;
          }
        },
        error: (error) => console.error('Error loading conversations:', error)
      });
  }

  /**
   * Mark messages as read
   */
  markAsRead(conversationId: number): void {
    if (!this.currentUser) return;

    this.messageService.markMessagesAsRead(conversationId, this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update unread count in conversation list
          const conv = this.conversations.find(c => c.conversation_id === conversationId);
          if (conv) {
            conv.unread_count = 0;
          }
        },
        error: (error) => console.error('Error marking as read:', error)
      });
  }

  /**
   * Handle typing
   */
  onTyping(): void {
    if (!this.currentUser || !this.selectedConversation) return;

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Send typing indicator
    this.messageService.setTypingIndicator(
      this.selectedConversation.conversation_id,
      this.currentUser.id
    ).subscribe();

    // Set timeout to stop sending after 3 seconds
    this.typingTimeout = setTimeout(() => {
      // Typing stopped
    }, 3000);
  }

  /**
   * Check if other user is typing
   */
  checkTypingStatus(): void {
    if (!this.currentUser || !this.selectedConversation) return;

    this.messageService.getTypingStatus(
      this.selectedConversation.conversation_id,
      this.currentUser.id
    ).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.success) {
          this.isOtherUserTyping = response.data?.user_name ? true : false;
          this.otherUserTypingName = response.data?.user_name || '';
        }
      },
      error: (error) => console.error('Error checking typing:', error)
    });
  }

  /**
   * Scroll to bottom of messages
   */
  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  /**
   * Get filtered conversations
   */
  getFilteredConversations(): Conversation[] {
    if (!this.searchQuery.trim()) {
      return this.conversations;
    }
    return this.conversations.filter(conv => 
      conv.other_user_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  /**
   * Format time
   */
  formatTime(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Format message time
   */
  formatMessageTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  /**
   * Get user initials
   */
  getUserInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Is message from current user
   */
  isMyMessage(message: Message): boolean {
    return message.sender_id === this.currentUser?.id;
  }
}


