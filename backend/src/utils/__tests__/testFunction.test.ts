import { sum } from "../testFunction";

describe("sum", () => {
  it("should add two numbers", () => {
    expect(sum(1, 2)).toBe(3);
  });

  it("should add two negative numbers", () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});
