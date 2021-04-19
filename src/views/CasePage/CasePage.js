import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UploadButton from "../../components/UploadButton/UploadButton";
import formatDate from "../../assets/helpers/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import * as CaseService from "../../services/CaseService";
import * as DocumentService from "../../services/DocumentService";
import { Link } from "react-router-dom";

export default class CasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      case: null,
      show: null,
      error: null,
      documents: [],
    };
  }

  componentDidMount() {
    const caseId = this.props.match.params.case_id;

    CaseService.getCase(caseId)
      .then((doc) => {
        if (doc.exists) {
          this.setState({ case: doc.data() });
        } else {
          this.setState({ error: `No record found with id ${caseId}` });
        }
      })
      .catch(() => this.setState({ errorCode: "create-list-error" }));

    DocumentService.getDocuments(caseId).then((snapshot) => {
      const docs = [];
      snapshot.forEach((doc) => docs.push(doc.data()));
      console.log(docs);
      this.setState({ documents: docs });
    });
  }

  render() {
    return (
      <>
        <Sidebar active="mycases" />
        <div className="tm-main uk-section uk-section-default">
          <div className="uk-container uk-position-relative uk-margin-remove">
            <Link
              to="/mycases"
              className="uk-button uk-button-default uk-margin-bottom"
              type="button"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
            {this.state.case ? (
              <div>
                <div className="uk-clearfix">
                  <div className="uk-float-left">
                    <p className="uk-text-lead uk-text-bold uk-margin-remove">
                      {this.state.case["first_name"]}{" "}
                      {this.state.case["last_name"]} ({this.state.case.location}
                      )
                    </p>
                    <p className="uk-margin-remove">
                      {this.state.case["fromLanguage"]} to{" "}
                      {this.state.case["toLanguage"]}
                    </p>
                    <p className="uk-margin-remove-top">
                      #{this.state.case["case_number"]}
                    </p>
                  </div>
                  <div className="uk-float-right">
                    <p className="uk-text-lead uk-text-bold">
                      DUE {formatDate(this.state.case.due_date)}
                    </p>
                  </div>
                </div>
                <table className="uk-table uk-table-divider">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Date Completed</th>
                      <th>Translation Status</th>
                      <th>File type</th>
                      <th>File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.documents.map((onboard, i) => (
                      <React.Fragment
                        key={onboard.first_name + onboard.last_name + " " + i}
                      >
                        <tr
                          onClick={() => {
                            this.setState({
                              show: this.state.show === i ? null : i,
                            });
                          }}
                        >
                          <td>{onboard.name}</td>
                          <td>
                            {onboard.date_completed
                              ? formatDate(onboard.date_completed, true)
                              : "--"}
                          </td>
                          <td>
                            {onboard.translated_document_link
                              ? "Complete"
                              : "Active"}
                          </td>
                          <td>{onboard.file_type}</td>
                          <td>
                            <a
                              href={onboard.file_link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                        <tr
                          style={{
                            display: this.state.show === i ? "" : "none",
                            borderTop: "none",
                          }}
                        >
                          <td colSpan={5}>
                            <img
                              id={`frame-${i}`}
                              title={onboard.name}
                              alt="Original Document"
                              src={onboard.file_link}
                            ></img>
                            <p>
                              <b>Uploaded Document</b>
                            </p>
                            {onboard.translated_document_link ? (
                              <div>
                                <p>
                                  <a
                                    href={onboard.translated_document_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {onboard.name}
                                  </a>
                                </p>
                                <img
                                  id={`frame-translated-${i}`}
                                  title={onboard.name}
                                  alt="Translated Document"
                                  src={onboard.translated_document_link}
                                ></img>
                              </div>
                            ) : (
                              <p>-</p>
                            )}
                            <br></br>
                            <div className="uk-clearfix">
                              <div className="uk-float-right">
                                {onboard.translated_document_link ? (
                                  <>
                                    <button
                                      className="uk-button uk-button-primary"
                                      style={{ marginRight: "5px" }}
                                    >
                                      View Certification
                                    </button>
                                    <button className="uk-button uk-button-primary">
                                      Undo Complete
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="uk-button uk-button-primary"
                                      style={{ marginRight: "5px" }}
                                    >
                                      Complete Task
                                    </button>
                                    <UploadButton document={onboard} />
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <hr />
                <p className="uk-margin-remove">Note: {this.state.case.note}</p>
                <p className="uk-margin-remove">
                  PM: {this.state.case.project_manager}
                </p>
                <p className="uk-margin-remove">
                  <a href={`mailto:${this.state.case.email}`}>
                    Send a message regarding this case
                  </a>
                </p>
              </div>
            ) : (
              <div>{this.state.error}</div>
            )}
          </div>
        </div>
      </>
    );
  }
}
