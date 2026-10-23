import { Send } from "lucide-react";
import { DeleteMessageDialog } from "./delete-message-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { DeleteGroupDialog } from "./delete-group-dialog";
import { useChatWindow, type UseChatWindowProps } from "~/hooks";
import {
    ChatWindowHeader,
    ChatActiveOrderBanner,
    ChatMessageList,
    ChatMessageInput,
    ChatGroupInfoPanel
} from "./chat";

export function ChatWindow(props: UseChatWindowProps & { onBack?: () => void; internalTeamMembers?: any[] }) {
    const {
        inputValue,
        setInputValue,
        replyingTo,
        setReplyingTo,
        editingMessageId,
        setEditingMessageId,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isGroupInfoOpen,
        setIsGroupInfoOpen,
        memberToRemove,
        setMemberToRemove,
        isDeleteGroupOpen,
        setIsDeleteGroupOpen,
        activeOrder,
        isOrderDismissed,
        setIsOrderDismissed,
        fileInputRef,
        messagesEndRef,
        avatarDetails,
        handleSendOrderReference,
        handleSend,
        handleEditClick,
        handleFileUpload,
        handleDeleteClick,
        handleDeleteForEveryone,
        handleDeleteForMe
    } = useChatWindow(props);

    if (!props.activeContact) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-[#A1A1A1] font-['Inter']">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-[#E5E5E5] mb-4">
                    <Send className="w-8 h-8 text-[#E5E5E5]" />
                </div>
                <h3 className="text-xl font-bold text-[#333] mb-1">Your Messages</h3>
                <p className="text-sm">Select a contact to start a conversation</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50 relative w-full mb-0 font-['Inter'] overflow-hidden">
            {/* Subtle background dots pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
                    backgroundSize: "32px 32px"
                }}
            />

            {/* Header */}
            <ChatWindowHeader
                activeContact={props.activeContact}
                avatarDetails={avatarDetails}
                onBack={props.onBack}
                onOpenGroupInfo={() => setIsGroupInfoOpen(true)}
            />

            {/* Message Stream */}
            <ChatMessageList
                messages={props.messages}
                isLoadingHistory={Boolean(props.isLoadingHistory)}
                currentUser={props.currentUser}
                activeContact={props.activeContact}
                onReply={(msg) => setReplyingTo(msg)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                messagesEndRef={messagesEndRef}
            />

            {/* Active Order Reference Banner */}
            <ChatActiveOrderBanner
                activeOrder={activeOrder}
                currentUserRole={props.currentUser?.role}
                onDismiss={() => setIsOrderDismissed(true)}
                onSendOrderReference={handleSendOrderReference}
            />

            {/* Input Form Area */}
            <ChatMessageInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                editingMessageId={editingMessageId}
                replyingTo={replyingTo}
                onCancelReplyOrEdit={() => {
                    setEditingMessageId(null);
                    setReplyingTo(null);
                    if (editingMessageId) setInputValue("");
                }}
                fileInputRef={fileInputRef}
                onFileUpload={handleFileUpload}
                onSend={handleSend}
            />

            {/* Dialogs */}
            <DeleteMessageDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDeleteForEveryone={handleDeleteForEveryone}
                onDeleteForMe={handleDeleteForMe}
            />

            <ChatGroupInfoPanel
                isOpen={isGroupInfoOpen}
                onClose={() => setIsGroupInfoOpen(false)}
                activeContact={props.activeContact}
                avatarDetails={avatarDetails}
                currentUser={props.currentUser}
                internalTeamMembers={props.internalTeamMembers || []}
                onAddMembers={props.onAddMembers}
                onSelectMemberToRemove={setMemberToRemove}
                onOpenDeleteGroup={() => setIsDeleteGroupOpen(true)}
            />

            <RemoveMemberDialog
                open={memberToRemove !== null}
                onOpenChange={(open) => !open && setMemberToRemove(null)}
                memberName={memberToRemove?.name || ""}
                onConfirm={async () => {
                    if (memberToRemove && props.onRemoveMember) {
                        try {
                            await props.onRemoveMember(memberToRemove.id);
                        } catch (e) {
                            console.error("Failed handling remove member", e);
                        }
                    }
                }}
            />

            <DeleteGroupDialog
                open={isDeleteGroupOpen}
                onOpenChange={setIsDeleteGroupOpen}
                groupName={props.activeContact.username || ""}
                onConfirm={async () => {
                    if (props.onDeleteGroup) {
                        try {
                            await props.onDeleteGroup();
                            setIsGroupInfoOpen(false);
                        } catch (e) {
                            console.error("Failed to delete group", e);
                        }
                    }
                }}
            />
        </div>
    );
}
