import QRCode from 'qrcode';

export default async (id: string) => {
  try {
    const result = await QRCode.toDataURL(id);
    return result;

  } catch (err) {
    console.error(err)
  }
}