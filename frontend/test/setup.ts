import "@testing-library/jest-dom/vitest";
import "vitest-localstorage-mock";
import { beforeEach } from "vitest";

beforeEach(() => {
  localStorage.clear();
});
