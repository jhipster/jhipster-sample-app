import { Service } from '@angular/core';

import { getPageNumberFromLinkHeader, parseLinkHeader } from 'app/shared/jhipster/link-header';

/**
 * A utility service for link parsing.
 */
@Service()
export class ParseLinks {
  /**
   * Method to parse the links
   */
  parseAll(header: string): Record<string, Record<string, string | undefined> | undefined> {
    return parseLinkHeader(header);
  }

  /**
   * Method to parse the links
   */
  parse(header: string): Record<string, number> {
    return getPageNumberFromLinkHeader(header);
  }
}
