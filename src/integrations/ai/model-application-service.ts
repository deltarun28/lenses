/**
 * Future extension point — intentionally not implemented in the MVP.
 *
 * The plan is an "apply this lens to my situation" feature: the user describes a
 * real problem and receives a structured application of the lens. Implementing
 * it means writing an adapter that satisfies this interface and wiring it into
 * the lens page.
 *
 * Deliberately absent for now: any provider client, any API key handling, any
 * mock response, and any UI. Do not add them without an explicit instruction.
 */

export interface ModelApplicationInput {
  lensId: string;
  situation: string;
}

export interface ModelApplicationResult {
  lensId: string;
  /** How the lens reframes the situation. */
  reframing: string;
  /** Concrete prompts the user should answer next. */
  questions: string[];
  /** Where this lens is likely to mislead in this particular situation. */
  cautions: string[];
}

export interface ModelApplicationService {
  applyModel(input: ModelApplicationInput): Promise<ModelApplicationResult>;
}
