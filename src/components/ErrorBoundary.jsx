import { Component } from 'react';
import { toast } from 'react-hot-toast';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    toast.error('Something went wrong. Please refresh the page.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-200 max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-slate-600 mb-6">We're sorry for the inconvenience. Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-950 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;