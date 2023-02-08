import * as React from 'react';
import Ably from 'ably';

const ably = new Ably.Realtime({
  key: 'YOUR_ABLY_API_KEY',
});

export default function App() {
  const [pressed, setPressed] = React.useState(false);
  const [channel, setChannel] = React.useState(null);

  const openDoor = () => {
    if (channel) {
      channel.publish('open', { event: 'open' });
    }
  };

  const closeDoor = () => {
    if (channel) {
      channel.publish('close', { event: 'close' });
    }
  };

  React.useEffect(() => {
    const newChannel = ably.channels.get('door');
    setChannel(newChannel);

    newChannel.attach((error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Connected to Ably channel');
      }
    });

    return () => {
      newChannel.detach();
    };
  }, []);

  React.useEffect(() => {
    if (pressed) {
      openDoor();
      setTimeout(() => {
        closeDoor();
      }, 5000);
    }
  }, [pressed]);

  return (
    <div className="w-full flex items-center justify-center py-16 flex-col gap-16">
      {pressed ? 'Opening...' : 'Not Opening'}
      <button
        className="rounded-full border-8 border-gray-300 p-12 bg-red-600 active:bg-green-900"
        onMouseDown={(e) => setPressed(true)}
        onMouseUp={(e) => setPressed(false)}
      ></button>
    </div>
  );
}
