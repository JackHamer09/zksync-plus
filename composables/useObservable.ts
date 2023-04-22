type CallbackFunction = () => void;
class Observable {
  private subscribers: CallbackFunction[] = [];

  public subscribe(callback: CallbackFunction) {
    this.subscribers.push(callback);
    const unsubscribe = () => {
      this.unsubscribe(callback);
    };
    return unsubscribe;
  }

  public unsubscribe(callback: CallbackFunction) {
    const index = this.subscribers.indexOf(callback);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  public notify() {
    this.subscribers.forEach((callback) => {
      callback();
    });
  }
}

export default () => {
  const observable = new Observable();

  return {
    subscribe: observable.subscribe.bind(observable),
    notify: observable.notify.bind(observable),
  };
};
