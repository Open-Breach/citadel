# Spec Delta

## Purpose

Defines the page that shows the founding charter of Open-Breach, which starts as a working draft and is refined until the organisation is founded.

## ADDED Requirements

### Requirement: The charter has a page
The site SHALL serve the founding charter of Open-Breach at `/charter`, as readable text with headings.

#### Scenario: Opening the page
- **WHEN** a visitor activates Charter in the navigation
- **THEN** the Charter page opens with the status 200 and shows the charter's text

### Requirement: Marked as a draft
Until Open-Breach is founded, the Charter page SHALL say at its top, before the text, that the charter is a working draft that will change, and SHALL show the date of its last change.

#### Scenario: Before the founding
- **WHEN** the charter is still a draft
- **THEN** the note that it is a working draft and the date of the last change are the first things on the page

#### Scenario: After the founding
- **WHEN** the charter has been adopted and is marked as final
- **THEN** the note is gone and the page shows the date of adoption

### Requirement: The text is changed without layout work
Changing the charter SHALL need a change to its text only.

#### Scenario: A new paragraph
- **WHEN** a paragraph is added to the charter's text
- **THEN** the Charter page shows it, with no change to any other file
