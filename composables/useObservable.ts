type CallbackFunction<T> = (param: T) => void;
class Observable<T> {
  private subscribers: CallbackFunction<T>[] = [];

  public subscribe(callback: CallbackFunction<T>) {
    this.subscribers.push(callback);
    const unsubscribe = () => {
      this.unsubscribe(callback);
    };
    return unsubscribe;
  }

  public unsubscribe(callback: CallbackFunction<T>) {
    const index = this.subscribers.indexOf(callback);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  public notify(param: T) {
    this.subscribers.forEach((callback) => {
      callback(param);
    });
  }
}

export default <T>() => {
  const observable = new Observable<T>();

  return {
    subscribe: observable.subscribe.bind(observable),
    notify: observable.notify.bind(observable),
  };
};
