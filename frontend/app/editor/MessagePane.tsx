import type { NetlistRuleViolation } from "./types";

type MessagePaneProps = {
  violations: NetlistRuleViolation[];
};

function MessagePaneWithViolations({ violations: ruleViolations }: MessagePaneProps) {
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

export function MessagePane({ violations }: MessagePaneProps) {
  const hasViolations = (violations.length > 0);
  return (
    <>
      {hasViolations ?
        <MessagePaneWithViolations violations={violations} />  :
        <MessagePaneWithoutViolations />
      }
    </>
  );
}
