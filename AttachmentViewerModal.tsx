import { useEffect, useMemo, useState } from 'react';
import { Modal, Image, Text, Button, Icon, registerIcon, useModalContext } from '@pega/cosmos-react-core';
import * as scaleUp from '@pega/cosmos-react-core/lib/components/Icon/icons/scale-up.icon';
import * as scaleDown from '@pega/cosmos-react-core/lib/components/Icon/icons/scale-down.icon';
import { createAttachmentBlobUrl, createAttachmentDataUrl, type AttachmentContent } from './utils/attachmentContentUtils';
import type { LocalizationMap } from './utils/useLocalization';

registerIcon(scaleUp, scaleDown);

interface AttachmentViewerModalProps {
  attachment: AttachmentContent | null;
  l: LocalizationMap;
  showPdfToolbar: boolean;
  allowModalResize: boolean;
}

function AttachmentViewerModal({ attachment, l, showPdfToolbar, allowModalResize }: AttachmentViewerModalProps) {
  const { dismiss } = useModalContext();
  const [imageFailed, setImageFailed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const contentHeight = isMaximized ? '85vh' : '75vh';

  const blobUrl = useMemo(
    () =>
      attachment && attachment.mimeType.toLowerCase().startsWith('image/')
        ? createAttachmentBlobUrl(attachment.base64Content, attachment.mimeType)
        : '',
    [attachment]
  );

  useEffect(() => {
    if (!blobUrl) {
      return undefined;
    }
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  const resizeToggle = allowModalResize && (
    <Button
      icon
      compact
      variant='simple'
      label={isMaximized ? l.RestoreSize : l.MaximizeSize}
      aria-label={isMaximized ? l.RestoreSize : l.MaximizeSize}
      onClick={() => setIsMaximized(prev => !prev)}
    >
      <Icon name={isMaximized ? 'scale-down' : 'scale-up'} />
    </Button>
  );

  if (!attachment) {
    return (
      <Modal heading={l.LoadingAttachment} onDismiss={() => dismiss()} progress stretch={isMaximized} center>
        <div style={{ height: '12rem' }} />
      </Modal>
    );
  }

  const { fileName, mimeType } = attachment;
  const normalizedMimeType = mimeType.toLowerCase();

  let content;
  if (imageFailed) {
    content = <Text>{l.UnableToDisplayImage}</Text>;
  } else if (normalizedMimeType.startsWith('image/')) {
    content = (
      <Image
        src={blobUrl}
        alt={fileName}
        style={{ display: 'block', width: '100%', height: 'auto', maxHeight: contentHeight, objectFit: 'contain' }}
        onError={() => setImageFailed(true)}
      />
    );
  } else if (normalizedMimeType === 'application/pdf') {
    const pdfDataUrl = createAttachmentDataUrl(attachment.base64Content, normalizedMimeType);
    const pdfSrc = showPdfToolbar ? pdfDataUrl : `${pdfDataUrl}#toolbar=0&navpanes=0`;
    content = <iframe src={pdfSrc} title={fileName} style={{ width: '100%', height: contentHeight, border: 'none' }} />;
  } else {
    content = <Text>{l.FileTypeCannotBePreviewed}</Text>;
  }

  return (
    <Modal heading={fileName} onDismiss={() => dismiss()} stretch={isMaximized} center>
      <div style={{ padding: '0.5rem' }}>
        {resizeToggle && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{resizeToggle}</div>}
        {content}
      </div>
    </Modal>
  );
}

export default AttachmentViewerModal;
