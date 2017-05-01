/*
 * Merges own props, state and dispatch into props, puts dispatch under "actions"
 */
export const mergeProps = (stateProps, dispatchProps, ownProps) => (
  {...ownProps, ...stateProps, actions: {...dispatchProps}}
);
