import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import debounce from "lodash/debounce";
import { Server } from "./src/server";

export default function App() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendToServer = (message: string) => {
    setMessages((previous) => [message, ...previous]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    sendToServer(nextValue);
  };

  return (
    <main className="workspace">
      <section className="client" aria-labelledby="client-title">
        <div className="section-heading">
          <h2 id="client-title">Клиент</h2>
          <span className="section-note">localhost / browser</span>
        </div>
        <label htmlFor="search">Поиск</label>
        <input
          id="search"
          type="search"
          autoComplete="off"
          placeholder="Начните печатать…"
          value={value}
          onChange={handleChange}
        />
      </section>

      <div className="connection" aria-hidden="true">
        <span />
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
          <path
            d="M8 2v12m-4-4 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <Server messages={messages} />
    </main>
  );
}
