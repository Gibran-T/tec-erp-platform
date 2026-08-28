import type { ReactNode } from "react";

import type { BusinessDocumentContent } from "../types.js";

export interface BusinessDocumentViewProps {
  readonly document: BusinessDocumentContent;
  readonly onPrint?: () => void;
}

export function BusinessDocumentView(props: BusinessDocumentViewProps): ReactNode {
  const doc = props.document;

  return (
    <article
      className="ce-business-document"
      data-testid="business-document-view"
      data-document-id={doc.id}
    >
      <header className="ce-business-document__header">
        <div>
          <p className="ce-business-document__company">{doc.companyName}</p>
          <h2 data-testid="business-document-title">{doc.title}</h2>
        </div>
        <dl className="ce-business-document__meta">
          <div>
            <dt>Type</dt>
            <dd>{doc.docType}</dd>
          </div>
          <div>
            <dt>Référence</dt>
            <dd data-testid="business-document-reference">{doc.reference}</dd>
          </div>
          <div>
            <dt>Statut</dt>
            <dd>{doc.status}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{doc.issuedAt}</dd>
          </div>
        </dl>
      </header>

      {doc.sections.map((section) => (
        <section key={section.heading} className="ce-business-document__section">
          <h3>{section.heading}</h3>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          {section.rows && section.rows.length > 0 ? (
            <table className="ce-business-document__table">
              <tbody>
                {section.rows.map((row) => (
                  <tr key={`${row.label}-${row.value}`}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      ))}

      {doc.footerNote ? <footer className="ce-business-document__footer">{doc.footerNote}</footer> : null}

      <div className="ce-business-document__actions">
        <button
          type="button"
          data-testid="business-document-print"
          onClick={() => {
            if (props.onPrint) {
              props.onPrint();
              return;
            }
            window.print();
          }}
        >
          Imprimer / aperçu
        </button>
      </div>
    </article>
  );
}
