type SuccessStateInterface<T> = {
  status: 'success';
  data: T;
  error: null;
};

type ErrorStateInterface = {
  status: 'error';
  data: null;
  error: string;
};

type LoadingStateInterface = {
  status: 'loading';
  data: null;
  error: null;
};

export type StateInterface<T> =
  | SuccessStateInterface<T>
  | ErrorStateInterface
  | LoadingStateInterface;

export type ActionInterface<T extends string, P = never> = [P] extends [never]
  ? { type: T; [key: string]: unknown }
  : { type: T; payload: P; [key: string]: unknown };
