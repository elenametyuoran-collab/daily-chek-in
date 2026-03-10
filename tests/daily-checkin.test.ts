import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;

function checkIn(user: string) {
  return simnet.callPublicFn(
    "daily-checkin",
    "check-in",
    [],
    user
  );
}

function claim7NFT(user: string) {
  return simnet.callPublicFn(
    "daily-checkin",
    "claim-streak-7-nft",
    [],
    user
  );
}

function claim30NFT(user: string) {
  return simnet.callPublicFn(
    "daily-checkin",
    "claim-streak-30-nft",
    [],
    user
  );
}

function distributeRewards() {
  return simnet.callPublicFn(
    "daily-checkin",
    "distribute-rewards",
    [
      Cl.principal(alice),
      Cl.principal(bob),
      Cl.principal(alice),
      Cl.principal(bob),
      Cl.principal(alice),
    ],
    deployer
  );
}

describe("Daily Check-in Tests", () => {

  it("allows a user to check in", () => {
    const { result } = checkIn(alice);

    expect(result).toBeOk(
      Cl.tuple({
        streak: Cl.uint(1),
        "total-checkins": Cl.uint(1),
      })
    );
  });

  it("prevents checking in twice within the same day", () => {
    checkIn(alice);
    const { result } = checkIn(alice);

    expect(result).toBeErr(Cl.uint(100)); // ERR-ALREADY-CHECKED-IN
  });

  it("tracks total users correctly", () => {
    checkIn(alice);
    checkIn(bob);

    const users = simnet.callReadOnlyFn(
      "daily-checkin",
      "get-total-users",
      [],
      alice
    );

    expect(users.result).toBeOk(Cl.uint(2));
  });

  it("updates user stats after check-in", () => {
    checkIn(alice);

    const stats = simnet.callReadOnlyFn(
      "daily-checkin",
      "get-user-stats",
      [Cl.principal(alice)],
      alice
    );

    expect(stats.result).toBeOk(
      Cl.tuple({
        "last-checkin-block": Cl.uint(simnet.blockHeight),
        streak: Cl.uint(1),
        "total-checkins": Cl.uint(1),
        "nft-7-claimed": Cl.bool(false),
        "nft-30-claimed": Cl.bool(false),
      })
    );
  });

  it("does not allow claiming 7-day NFT without streak", () => {
    const { result } = claim7NFT(alice);

    expect(result).toBeErr(Cl.uint(101)); // ERR-NOT-ENOUGH-STREAK
  });

  it("allows claiming 7-day NFT after reaching streak", () => {
    for (let i = 0; i < 7; i++) {
      checkIn(alice);
      simnet.mineEmptyBlocks(144);
    }

    const { result } = claim7NFT(alice);

    expect(result).toBeOk(Cl.uint(1));
  });

  it("does not allow claiming the same NFT twice", () => {
    for (let i = 0; i < 7; i++) {
      checkIn(alice);
      simnet.mineEmptyBlocks(144);
    }

    claim7NFT(alice);
    const { result } = claim7NFT(alice);

    expect(result).toBeErr(Cl.uint(102)); // ERR-NFT-ALREADY-CLAIMED
  });

  it("allows owner to distribute rewards", () => {
    const { result, events } = distributeRewards();

    expect(result).toBeOk(Cl.bool(true));
    expect(events.length).toBe(5); // 5 STX transfers
  });

  it("prevents non-owner from distributing rewards", () => {
    const { result } = simnet.callPublicFn(
      "daily-checkin",
      "distribute-rewards",
      [
        Cl.principal(alice),
        Cl.principal(bob),
        Cl.principal(alice),
        Cl.principal(bob),
        Cl.principal(alice),
      ],
      alice
    );

    expect(result).toBeErr(Cl.uint(103)); // ERR-NOT-OWNER
  });

});
