import BigNumber from "bignumber.js";
import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

let findingsCount = 0;

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  if (findingsCount >= 5) return findings;

  // create finding if gas price is higher than threshold
  const gasPrice = new BigNumber(+txEvent.gasPrice / 1000000000);

  if (gasPrice.isGreaterThan("200")) {
    findings.push(
      Finding.fromObject({
        name: "Very High Gas Price",
        description: `Gas Price: ${gasPrice} gwei`,
        alertId: "FORTA-1",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
      })
    );
    findingsCount++;
  }

  return findings;
};

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

export default {
  handleTransaction,
  // handleBlock
};
