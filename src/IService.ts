export interface IService {
  waitPromise: Promise<void>;
  wait(): Promise<void>;
}
