// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationTokenRefreshOptions } from '@azure/communication-common';
import { AbortSignalLike } from '@azure/core-http';
/**
 * Create credentials that auto-refresh asynchronously.
 */
export const createAutoRefreshingCredential = (userId: string, token: string): AzureCommunicationTokenCredential => {
  const options: CommunicationTokenRefreshOptions = {
    token: token,
    tokenRefresher: refreshTokenAsync(userId),
    refreshProactively: true
  };


  return new AzureCommunicationTokenCredential(options);
};

const refreshTokenAsync = (userIdentity: string): ((abortSignal?: AbortSignalLike) => Promise<string>) => {
  return async (): Promise<string> => {
      throw new Error('could not refresh token');
  };
};
