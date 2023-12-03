import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/config/db';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const POST = async (request: NextRequest) => {
  const { public_id, id } = await request.json();
  try {
    const res = await cloudinary.uploader.destroy(public_id);

    if (res) {
      console.log(res);

      if (id) {
        const attachments = await prisma.attachment.delete({
          where: {
            id,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Asset successfully deleted',
          attachments,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: 'Asset successfully deleted',
          attachmentPublicId: public_id,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: 'Something went wrong when deleting asset',
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong when deleting asset',
    });
  }
};
