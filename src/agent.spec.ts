import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
} from "forta-agent";
import agent from "./agent";

describe("very high gas price agent", () => {
  let handleTransaction: HandleTransaction;

  const createTxEventWithGasPrice = (gasPrice: string) =>
    createTransactionEvent({
      receipt: {} as any,
      transaction: { gasPrice } as any,
      block: {} as any,
    });

  const getPriceInGwei = (price: string): string =>
    (+price * 1000000000).toString();

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("handleTransaction", () => {
    it("returns empty findings if gas price is less", async () => {
      const txEvent = createTxEventWithGasPrice(getPriceInGwei("100"));

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it("returns a finding if gas price is higher", async () => {
      const txEvent = createTxEventWithGasPrice(getPriceInGwei("201"));

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Very High Gas Price",
          description: `Gas Price: ${+txEvent.gasPrice / 1000000000} gwei`,
          alertId: "FORTA-1",
          type: FindingType.Info,
          severity: FindingSeverity.Info,
        }),
      ]);
    });
  });
});
