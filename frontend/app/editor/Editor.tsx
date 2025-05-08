import { useEffect, useState } from "react";

import { EditorWindow } from "./EditorWindow";
import { MessagePane } from "./MessagePane";
import { Sidebar } from "./Sidebar";

import "./editor.css";

import type { NetlistRuleViolation, Netlist } from "./types.d.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function fetchNetlists(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/netlist`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch netlist: ${response.status} ${errorText}`);
  }

  return await response.json();
}

async function fetchRuleViolations(netlistId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/netlist/${netlistId}/check`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch rule violations: ${errorText}`);
  }

  return await response.json();
}

function EditorMainPane({
  choice,
  violations,
}: {
  choice: Netlist | null;
  violations: NetlistRuleViolation[];
}) {
  console.log("EditorMainPane render", choice);
  return (
    <div className="main-pane flex flex-col h-full">
      {choice ? (
        <>
          <EditorWindow netlist={choice} />
          <MessagePane violations={violations} />
        </>
      ) : (
        <div className="main-pane items-center justify-center">
          No netlist selected
        </div>
      )}
    </div>
  );
}

export default function Editor() {
  const [netlists, setNetlists] = useState<Netlist[]>([]);
  const [choice, setChoice] = useState<Netlist | null>(null);
  const [violations, setViolations] = useState<NetlistRuleViolation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNetlists()
      .then((netlists) => setNetlists(netlists))
      .catch((err) => setError(err.message));
  }, []);

  function handleSelect(netlist: Netlist): void {
    if (netlist._id === undefined) {
      return;
    }
    fetchRuleViolations(netlist._id)
      .then((violations) => {
        setChoice(netlist);
        setViolations(violations);
      })
      .catch((err) => {
        setError(err.message);
        setChoice(null);
        setViolations([]);
      });
  }

  return (
    <div className="editor">
      <Sidebar netlists={netlists} choice={choice} onSelect={handleSelect} />
      <EditorMainPane choice={choice} violations={violations} />
    </div>
  );
}
