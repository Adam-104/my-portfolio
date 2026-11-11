import React from "react";
import Icon from "./Icon";
import { TLink } from "./PageTransition";
import { contact } from "../portfolio";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact__lead">
        <h2 id="contact-title" className="contact__title">
          {contact.titleStart} <em className="serif-italic">{contact.titleItalic}</em> {contact.titleEnd}
        </h2>
        <p className="contact__intro">{contact.intro}</p>
        <div className="contact__actions">
          <a className="btn btn--primary" href={`mailto:${contact.email}`}>
            <Icon name="mail" />
            Email me
          </a>
          <TLink className="btn" to="/resume">
            <Icon name="file" />
            Resume
          </TLink>
        </div>
      </div>
      <div className="panel contact__card">
        <dl>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a href={contact.phoneHref}>{contact.phone}</a></dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>
              <a href={contact.mapLink} target="_blank" rel="noopener noreferrer">{contact.location}</a>
            </dd>
          </div>
          {contact.links.map((l) => (
            <div key={l.name}>
              <dt>{l.name}</dt>
              <dd>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  <Icon name={l.icon} />
                  {l.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
