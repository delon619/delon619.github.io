import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';
export const maxDuration = 60;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userPhoto = formData.get('userPhoto') as File;
    const outfitPhoto = formData.get('outfitPhoto') as File;

    if (!userPhoto || !outfitPhoto) {
      return NextResponse.json(
        { error: 'Both user photo and outfit photo are required' },
        { status: 400 }
      );
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(userPhoto.type) || !validTypes.includes(outfitPhoto.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' },
        { status: 400 }
      );
    }

    // Convert files to base64
    const userPhotoBuffer = Buffer.from(await userPhoto.arrayBuffer());
    const outfitPhotoBuffer = Buffer.from(await outfitPhoto.arrayBuffer());
    
    const userPhotoBase64 = `data:${userPhoto.type};base64,${userPhotoBuffer.toString('base64')}`;
    const outfitPhotoBase64 = `data:${outfitPhoto.type};base64,${outfitPhotoBuffer.toString('base64')}`;

    console.log('Sending request to Replicate API...');

    // Use Replicate's IDM-VTON model for virtual try-on
    const output = await replicate.run(
      "viktorfa/oot_diffusion:4ce778337fed29b7e09ced536d35ad8ec515a392df1385b19c58ba4504218fdf",
      {
        input: {
          garm_img: outfitPhotoBase64,
          human_img: userPhotoBase64,
          garment_des: "clothing item",
        }
      }
    );

    console.log('Replicate API response:', output);

    // The output is typically a URL or array of URLs
    const resultUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({
      success: true,
      resultUrl: resultUrl,
      message: 'Virtual try-on generated successfully'
    });

  } catch (error: any) {
    console.error('Error generating virtual try-on:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate virtual try-on',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
