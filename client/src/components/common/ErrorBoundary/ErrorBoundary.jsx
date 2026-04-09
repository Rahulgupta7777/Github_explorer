import { Component } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage.jsx';

// class component kyuki hooks mein error boundary nahi hai abhi tak
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <ErrorMessage
          message={
            this.state.error.message ||
            'Something went wrong rendering this page.'
          }
          onRetry={this.reset}
        />
      );
    }
    return this.props.children;
  }
}
