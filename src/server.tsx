export function Server({ messages }: { messages: string[] }) {
  return (
    <section className="server" aria-labelledby="server-title">
      <div className="server-hardware" aria-hidden="true">
        <div className="drive"><i /><i /><i /><span className="led" /></div>
        <div className="drive"><i /><i /><i /><span className="led" /></div>
      </div>

      <div className="server-heading">
        <div>
          <span className="server-address">127.0.0.1</span>
          <h2 id="server-title">Локальный сервер</h2>
        </div>
        <span className="online"><span />Подключён</span>
      </div>

      <div className="terminal">
        <div className="terminal-heading">
          <span>Входящие сообщения</span>
          <span aria-hidden="true">↓</span>
        </div>
        <div className="message-log" role="log" aria-label="Сообщения сервера" aria-live="polite">
          {messages.length === 0 ? (
            <p className="empty">Ожидание первого сообщения<span className="cursor">_</span></p>
          ) : (
            <ol>
              {messages.map((message, index) => (
                <li key={messages.length - index}>
                  <span className="message-id">{String(messages.length - index).padStart(2, "0")}</span>
                  <span className="message-value">{JSON.stringify(message)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="terminal-footer">{messages.length === 0 ? "Соединение установлено" : "Последнее сообщение сверху"}</div>
      </div>
    </section>
  );
}
