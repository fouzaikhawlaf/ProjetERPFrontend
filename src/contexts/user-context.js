'use client';

import * as React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import {authClient} from 'G:/reactErp/soft-ui-dashboard-react-main/src/lib/auth/client';
import { logger } from 'G:/reactErp/soft-ui-dashboard-react-main/src/lib//auth/default-logger';

// Create a context with undefined as the default value
export const UserContext = React.createContext(undefined);

export function UserProvider({ children }) {
  const [state, setState] = React.useState({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async () => {
    try {
      const { data, error } = await authClient.getUser();

      if (error) {
        logger.error(error);
        setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
        return;
      }

      setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
export const UserConsumer = UserContext.Consumer;
