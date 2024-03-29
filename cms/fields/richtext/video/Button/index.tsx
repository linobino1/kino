/* eslint-disable import/no-extraneous-dependencies */
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Modal, useModal } from "@faceless-ui/modal";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { Form, Text, Submit } from "payload/components/forms";
import { MinimalTemplate, Button, X } from "payload/components";
import VideoIcon from "../Icon";

import "./index.scss";
import { ElementButton } from "@payloadcms/richtext-slate";

const initialFormData = {
  source: "youtube",
};

const baseClass = "video-rich-text-button";

const insertVideo = (editor: any, { url }: { url: string }) => {
  const text = { text: " " };

  const video = {
    type: "video",
    url,
    children: [text],
  };

  const nodes = [video, { type: "p", children: [{ text: "" }] }];

  if (editor.blurSelection) {
    Transforms.select(editor, editor.blurSelection);
  }

  Transforms.insertNodes(editor, nodes);
  ReactEditor.focus(editor);
};

const VideoButton: React.FC<{ path: string }> = ({ path }) => {
  const { openModal, toggleModal } = useModal();
  const editor = useSlate();
  const [renderModal, setRenderModal] = useState(false);
  const modalSlug = `${path}-add-video`;

  const handleAddVideo = useCallback(
    (_: any, { url }: { url: string }) => {
      insertVideo(editor, { url });
      toggleModal(modalSlug);
      setRenderModal(false);
    },
    [editor, toggleModal]
  );

  useEffect(() => {
    if (renderModal) {
      openModal(modalSlug);
    }
  }, [renderModal, openModal, modalSlug]);

  return (
    <Fragment>
      <ElementButton
        className={baseClass}
        format="video"
        onClick={(e) => {
          e.preventDefault();
          setRenderModal(true);
        }}
      >
        <VideoIcon />
      </ElementButton>
      {renderModal && (
        <Modal slug={modalSlug} className={`${baseClass}__modal`}>
          <MinimalTemplate className={`${baseClass}__template`}>
            <header className={`${baseClass}__header`}>
              <h3>Add Video</h3>
              <Button
                buttonStyle="none"
                onClick={() => {
                  toggleModal(modalSlug);
                  setRenderModal(false);
                }}
              >
                <X />
              </Button>
            </header>
            <Form
              // @ts-ignore
              onSubmit={handleAddVideo}
              initialData={initialFormData}
            >
              <Text label="Video URL" required name="url" />
              <Submit>Add video</Submit>
            </Form>
          </MinimalTemplate>
        </Modal>
      )}
    </Fragment>
  );
};

export default VideoButton;
