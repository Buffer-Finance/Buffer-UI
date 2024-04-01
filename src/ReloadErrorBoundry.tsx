import * as Sentry from '@sentry/react';
import { Component } from 'react';

class ReloadErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { reload: 0 };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // alert("Crashed!");
    // @ts-ignore
    this.setState({ reload: this.state?.reload + 1 });
    // Logging and reporting the error
    console.error('Error Boundary caught an error:', error, errorInfo);
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    // @ts-ignore
    return this.props?.children;
  }
}

export default ReloadErrorBoundary;
