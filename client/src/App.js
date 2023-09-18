import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isPaused: true,
    };
    this.handleData = this.handleData.bind(this)
  }

  componentDidMount() {
    this.setupEventSource();
  }

  handleData(event) {
    const eventData = JSON.parse(event.data);
    this.setState((prevState) => ({
      events: [...prevState.events, eventData],
    }));
  }

  setupEventSource() {
    const eventSource = new EventSource('http://localhost:5000/events');
    eventSource.addEventListener('custom-event', this.handleData)
    eventSource.onopen = () => {
      console.log('Connected to SSE');
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      this.togglePause()
      eventSource.close();
    };

    this.eventSource = eventSource;
  }

  togglePause = () => {
    if (this.state.isPaused) {
      this.eventSource.close();
      this.setState({ isPaused: false });
    } else {
      this.setupEventSource();
      this.setState({ isPaused: true });
    }
  };

  render() {
    const { events, isPaused } = this.state;
    return (
      <div>
        <h1>Pause and Resume the Server-Sent Events</h1>
        <p>Every 3 seconds the server auto disconnected or you press the Pause button</p>
        <button onClick={this.togglePause}>
          {isPaused ? 'Pause' : 'Resume'}
        </button>
        <ul>
          {events.map((event, index) => (
            <li key={index}>{JSON.stringify(event)}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
