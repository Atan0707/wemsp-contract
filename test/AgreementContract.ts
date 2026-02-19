import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("AgreementContract", function () {
  async function deployAgreementContract() {
    return ethers.deployContract("AgreementContract");
  }

  it("reverts when minting with duplicate beneficiary IDs", async function () {
    const agreement = await deployAgreementContract();

    await expect(
      agreement.mintAgreement("agreement-1", "ipfs://meta-1", ["ben-1", "ben-1"]),
    )
      .to.be.revertedWithCustomError(agreement, "DuplicateBeneficiaryId")
      .withArgs("ben-1");
  });

  it("reverts finalization when agreement is not fully signed", async function () {
    const agreement = await deployAgreementContract();

    await agreement.mintAgreement("agreement-2", "ipfs://meta-2", ["ben-1", "ben-2"]);

    await expect(agreement.finalizeAgreement(1))
      .to.be.revertedWithCustomError(agreement, "AgreementNotFullySigned")
      .withArgs(1n);
  });

  it("finalizes only after owner, witness, and all beneficiaries sign", async function () {
    const agreement = await deployAgreementContract();

    await agreement.mintAgreement("agreement-3", "ipfs://meta-3", ["ben-1", "ben-2"]);
    await agreement.recordOwnerSignature(1);
    await agreement.recordBeneficiarySignature(1, "ben-1");
    await agreement.recordBeneficiarySignature(1, "ben-2");
    await agreement.recordWitnessSignature(1);

    await expect(agreement.finalizeAgreement(1))
      .to.emit(agreement, "AgreementFinalized");

    const data = await agreement.getAgreement(1);
    expect(data.isFinalized).to.equal(true);
  });

  it("reverts when beneficiary count exceeds MAX_BENEFICIARIES", async function () {
    const agreement = await deployAgreementContract();

    const max = await agreement.MAX_BENEFICIARIES();
    const beneficiaries = Array.from({ length: Number(max) + 1 }, (_, i) => `ben-${i + 1}`);

    await expect(
      agreement.mintAgreement("agreement-4", "ipfs://meta-4", beneficiaries),
    )
      .to.be.revertedWithCustomError(agreement, "TooManyBeneficiaries")
      .withArgs(BigInt(beneficiaries.length), max);
  });
});
