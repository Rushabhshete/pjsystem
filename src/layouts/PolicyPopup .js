import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

const PolicyPopup = ({ open, onClose, policy }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ textAlign: "center" }}>{policy?.title || "Policy Title"}</DialogTitle>
      <DialogContent>
        {policy?.sections?.length > 0 ? (
          policy.sections.map((section, index) => (
            <div key={index}>
              <h3>{section.heading}</h3>
              <p>{section.content}</p>
              {section.subsections?.length > 0 && section.subsections.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <h4>{subsection.subheading}</h4>
                  <p>{subsection.content}</p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No policy details available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PolicyPopup;  // Ensure this export statement exists
