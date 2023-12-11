'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { imageFormats } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
const Attachments = ({ attachments }: { attachments: Attachment[] }) => {
  const [openDOCPDF, setOpenDOCPDF] = React.useState(false);
  const [openImg, setOpenImg] = React.useState(false);
  const [PDFTXTDOCLink, setPDFTXTDOCLink] = useState('');
  const [imgLink, setImgLink] = useState('');

  const handlePDFTXTDOCFullScreen = (link: string) => {
    setPDFTXTDOCLink(link);
    setOpenDOCPDF(true);
  };

  const handleImgFullScreen = (link: string) => {
    setImgLink(link);
    setOpenImg(true);
  };

  return (
    <>
      <div className='flex gap-5'>
        {attachments?.length === 0 && <p> No attchments added </p>}
        {attachments.map((attachment) => {
          return (
            <div key={attachment.id} className='my-5'>
              {imageFormats.includes(attachment.attachmentExtension) && (
                <Image
                  src={attachment.attachmentLink}
                  blurDataURL={attachment.attachmentLink}
                  placeholder='blur'
                  alt='task_image'
                  height={250}
                  width={250}
                  className='cursor-pointer'
                  onClick={() => handleImgFullScreen(attachment.attachmentLink)}
                />
              )}
              {attachment.attachmentExtension === 'pdf' && (
                <Image
                  src='/pdf-logo.svg'
                  alt='landing'
                  width='100'
                  height='100'
                  placeholder='blur'
                  blurDataURL='/pdf-logo.svg'
                  className='cursor-pointer'
                  onClick={() =>
                    handlePDFTXTDOCFullScreen(attachment.attachmentLink)
                  }
                />
              )}
              {attachment.attachmentExtension === 'doc' && (
                <Image
                  src='/doc-logo.svg'
                  alt='landing'
                  width='100'
                  height='100'
                  placeholder='blur'
                  blurDataURL='/doc-logo.svg'
                  className='cursor-pointer'
                  onClick={() =>
                    handlePDFTXTDOCFullScreen(attachment.attachmentLink)
                  }
                />
              )}
              {attachment.attachmentExtension === 'txt' && (
                <Image
                  src='/txt-logo.svg'
                  alt='landing'
                  width='100'
                  height='100'
                  placeholder='blur'
                  blurDataURL='/txt-logo.svg'
                  className='cursor-pointer'
                  onClick={() =>
                    handlePDFTXTDOCFullScreen(attachment.attachmentLink)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
      <Dialog open={openDOCPDF} onOpenChange={setOpenDOCPDF}>
        <DialogContent className='sm:max-w-[640px]'>
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          <iframe
            src={`https://docs.google.com/gview?url=${PDFTXTDOCLink}&embedded=true`}
            height='600'
            width='600'
          ></iframe>
        </DialogContent>
      </Dialog>

      <Dialog open={openImg} onOpenChange={setOpenImg}>
        <DialogContent className='sm:max-w-[640px]'>
          <DialogHeader>
            <DialogTitle>View Image</DialogTitle>
          </DialogHeader>
          <Image
            src={imgLink}
            blurDataURL={imgLink}
            placeholder='blur'
            alt='task_image'
            height={600}
            width={600}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Attachments;
