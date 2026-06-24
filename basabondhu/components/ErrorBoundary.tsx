"use client";

import React, { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[BasaBondhu ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-lg font-black text-text-main mb-2">
            {this.props.fallbackTitle || "Something went wrong"}
          </h2>
          <p className="text-xs text-text-muted max-w-md leading-relaxed mb-6">
            An unexpected error occurred. This won&apos;t affect your saved data. Try refreshing the page.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="px-5 py-2.5 bg-primary hover:bg-secondary text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="block mx-auto px-5 py-2 text-primary text-xs font-bold hover:underline cursor-pointer"
            >
              Reload Page
            </button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 text-left max-w-lg w-full">
              <summary className="text-[10px] font-bold text-text-muted uppercase tracking-wider cursor-pointer">
                Error Details (dev only)
              </summary>
              <pre className="mt-2 p-3 bg-bg-alt border border-border-light rounded-xl text-[10px] text-rose-600 overflow-x-auto whitespace-pre-wrap">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
