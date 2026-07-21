import type { InboxMessage } from "@tec-platform/contracts";
import type { ReactNode } from "react";
import { useState } from "react";

import { useFirstDayData } from "../../first-day/FirstDayDataContext.js";
import {
  formatUnreadCountMessage,
  MESSAGE_READ_SUCCESS_FEEDBACK,
} from "../../first-day/firstDayCopy.js";
import { MANAGER_NAME } from "../../workspace/workspaceCopy.js";

function InboxMessageRow({
  message,
  isSelected,
  onSelect,
}: {
  message: InboxMessage;
  isSelected: boolean;
  onSelect: () => void;
}): ReactNode {
  const isUnread = message.readAt === null;

  return (
    <button
      type="button"
      className={`workspace-inbox__item${isSelected ? " workspace-inbox__item--selected" : ""}${
        isUnread ? " workspace-inbox__item--unread" : ""
      }`}
      data-testid={`inbox-message-${message.messageKey}`}
      aria-pressed={isSelected}
      aria-current={isSelected ? "true" : undefined}
      onClick={onSelect}
    >
      <div className="workspace-inbox__item-header">
        <span className="workspace-inbox__sender">{message.fromName}</span>
        {isUnread ? (
          <span className="workspace-inbox__unread" data-testid="inbox-unread-indicator">
            Non lu
          </span>
        ) : (
          <span className="workspace-inbox__read-label">Lu</span>
        )}
      </div>
      <strong className="workspace-inbox__subject">{message.subject}</strong>
      <p className="workspace-inbox__preview">{message.preview}</p>
    </button>
  );
}

function InboxMessageDetail({
  message,
  onMarkRead,
  isMarkingRead,
  markReadError,
  messageReadSuccess,
}: {
  message: InboxMessage;
  onMarkRead: () => void;
  isMarkingRead: boolean;
  markReadError: string | null;
  messageReadSuccess: boolean;
}): ReactNode {
  const isUnread = message.readAt === null;

  return (
    <article className="workspace-inbox__detail" data-testid="inbox-message-detail">
      <header className="workspace-inbox__detail-header">
        <p className="workspace-inbox__detail-from">De : {message.fromName}</p>
        <h2>{message.subject}</h2>
      </header>
      <div className="workspace-inbox__body">{message.body}</div>
      {isUnread ? (
        <button
          type="button"
          className="workspace-inbox__read-button"
          data-testid="inbox-mark-read-button"
          disabled={isMarkingRead}
          aria-busy={isMarkingRead}
          onClick={onMarkRead}
        >
          {isMarkingRead ? "Enregistrement…" : "Marquer comme lu"}
        </button>
      ) : (
        <p className="workspace-inbox__read-confirmation" data-testid="inbox-read-confirmation">
          {messageReadSuccess
            ? MESSAGE_READ_SUCCESS_FEEDBACK
            : "Message lu."}
        </p>
      )}
      {markReadError ? (
        <p className="workspace-first-day__error" role="alert" data-testid="inbox-mark-read-error">
          {markReadError}
        </p>
      ) : null}
    </article>
  );
}

export function InboxAppPage(): ReactNode {
  const {
    inbox,
    initialLoading,
    loadError,
    markReadError,
    markingMessageKey,
    messageReadSuccess,
    markMessageRead,
    clearMarkReadError,
  } = useFirstDayData();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  if (initialLoading && inbox === null) {
    return (
      <section data-testid="inbox-app-page">
        <p
          className="workspace-first-day__status"
          role="status"
          data-testid="inbox-initial-loading"
        >
          Chargement de votre boîte de réception…
        </p>
      </section>
    );
  }

  if (loadError && inbox === null) {
    return (
      <section data-testid="inbox-app-page">
        <p className="workspace-first-day__error" role="alert" data-testid="inbox-load-error">
          {loadError}
        </p>
      </section>
    );
  }

  const messages = inbox?.messages ?? [];
  const activeKey = selectedKey ?? messages[0]?.messageKey ?? null;
  const selectedMessage = messages.find((message) => message.messageKey === activeKey) ?? null;
  const unreadCount = inbox?.unreadCount ?? 0;

  return (
    <section className="workspace-inbox" data-testid="inbox-app-page">
      <header className="workspace-inbox__header">
        <h1>Boîte de réception</h1>
        <p data-testid="inbox-unread-summary">{formatUnreadCountMessage(unreadCount)}</p>
      </header>

      {messages.length === 0 ? (
        <p className="workspace-first-day__status">
          Aucun message professionnel pour le moment. Votre gestionnaire, {MANAGER_NAME}, vous
          contactera sous peu.
        </p>
      ) : (
        <div className="workspace-inbox__layout">
          <div className="workspace-inbox__list" data-testid="inbox-message-list">
            {messages.map((message) => (
              <InboxMessageRow
                key={message.messageKey}
                message={message}
                isSelected={message.messageKey === activeKey}
                onSelect={() => {
                  setSelectedKey(message.messageKey);
                  clearMarkReadError();
                }}
              />
            ))}
          </div>

          {selectedMessage ? (
            <InboxMessageDetail
              message={selectedMessage}
              isMarkingRead={markingMessageKey === selectedMessage.messageKey}
              markReadError={markReadError}
              messageReadSuccess={messageReadSuccess}
              onMarkRead={() => {
                void markMessageRead(selectedMessage.messageKey);
              }}
            />
          ) : null}
        </div>
      )}
    </section>
  );
}
