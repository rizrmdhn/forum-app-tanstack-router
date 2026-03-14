type SuccessStateInterface<T> = {
  status: 'success';
  data: T;
  error: null;
};

type ErrorStateInterface<T> = {
  status: 'error';
  data: T | null;
  error: string;
};

type LoadingStateInterface<T> = {
  status: 'loading';
  data: T | null;
  error: null;
};

export type StateInterface<T> =
  | SuccessStateInterface<T>
  | ErrorStateInterface<T>
  | LoadingStateInterface<T>;

export type ActionInterface<T extends string, P = never> = [P] extends [never]
  ? { type: T; [key: string]: unknown }
  : { type: T; payload: P; [key: string]: unknown };
