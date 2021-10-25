import { html, nothing, TemplateResult } from 'lit';

interface EventDetail {
  value: string | number | boolean | null | undefined;
}

const renderDetail = (detail: EventDetail): string => {
  const result = detail;
  const undef = 'undefined';
  if ('value' in detail && detail.value === undefined) {
    result.value = undef;
  }
  return ` detail: ${JSON.stringify(detail).replace(`"${undef}"`, undef)}`;
};

export const renderEvents = (log: CustomEvent[]): TemplateResult =>
  html`
    ${log.map((event) => {
      return html`
        <p part="event-record">
          event:
          ${event.type}.${event.detail == null
            ? nothing
            : renderDetail(event.detail)}
        </p>
      `;
    })}
  `;
