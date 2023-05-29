import { useRef, useEffect } from 'react';

type Subscription<T> = {
  name: string;
  callback: (val?: T) => void;
};

export default class EventEmitter<T> {
  private subscriptions = new Set<Subscription<T>>();

  emit = (eventName: string, val?: T) => {
    for (const event of this.subscriptions) {
      if (eventName !== undefined && event.name === eventName) {
        event.callback?.(val);
      }
    }
  };

  on = (eventName: string, callback: Subscription<T>['callback']) => {
    const eventRef = useRef<Subscription<T>>();
    eventRef.current = { name: eventName, callback };
    useEffect(() => {
      function callbackWrap(val?: T) {
        if (eventRef.current?.callback) {
          eventRef.current.callback(val);
        }
      }
      const subscription = {
        name: eventName,
        callback: callbackWrap,
      };
      this.subscriptions.add(subscription);
      return () => {
        this.subscriptions.delete(subscription);
      };
    }, []);
  };
}
