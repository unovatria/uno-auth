import { Resend } from 'resend';
import { VerificationToken_RefreshURL } from '@/routes';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {

  const confirmLink = `${VerificationToken_RefreshURL}${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: 'Confirm your email address',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email address.</p>`,
  });

  if (error) {
    console.log("erorr on otokken" + error);
    return false;
  }

  return true;
};