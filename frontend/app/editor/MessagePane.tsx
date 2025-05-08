import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import type { NetlistRuleViolation } from "./types";

type MessagePaneProps = {
  ruleViolations: NetlistRuleViolation[];
};

function MessagePaneWithViolations({ ruleViolations }: MessagePaneProps) {
  return (
    <div className="message-pane">
      <table aria-label="rule violations">
        <thead>
          <tr>
            <td>
              Rule
            </td>
            <td>
              Detail
            </td>
          </tr>
        </thead>
        <tbody>
          {ruleViolations.map((violation) => (
            <tr key={violation._id}>
              <td>{violation.rule}</td>
              <td>{violation.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessagePaneWithoutViolations() {
  return (
    <div className="message-pane">
      <p>No reported errors.</p>
    </div>
  );
}

export function MessagePane({ ruleViolations }: MessagePaneProps) {
  if (ruleViolations.length > 0) {
    return <MessagePaneWithViolations ruleViolations={ruleViolations} />;
  } else {
    return <MessagePaneWithoutViolations />;
  }
}
