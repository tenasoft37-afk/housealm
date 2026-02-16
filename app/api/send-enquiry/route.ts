import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            title,
            firstName,
            lastName,
            email,
            telephone,
            topic,
            message,
            productName,
            productSku,
            date,
            time,
            type = "Product Enquiry" // Default type
        } = body;

        let subject = "";
        let htmlContent = "";

        // Customize email based on type
        switch (type) {
            case "Booking Request":
                subject = `New Booking Request: ${productName} - ${firstName} ${lastName}`;
                htmlContent = `
                    <h1>New Booking Request</h1>
                    <p><strong>Product:</strong> ${productName} (SKU: ${productSku})</p>
                    <p><strong>Requested Date:</strong> ${date}</p>
                    <p><strong>Requested Time:</strong> ${time}</p>
                    <hr />
                    <p><strong>Name:</strong> ${title} ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${telephone}</p>
                    <p><strong>Topic:</strong> ${topic}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `;
                break;
            case "Community Join":
                subject = `New Community Member: ${email}`;
                htmlContent = `
                    <h1>New Community Join Request</h1>
                    <p><strong>Email:</strong> ${email}</p>
                `;
                break;
            case "Product Enquiry":
            default:
                subject = `New Enquiry: ${productName} - ${firstName} ${lastName}`;
                htmlContent = `
                    <h1>New Product Enquiry</h1>
                    <p><strong>Product:</strong> ${productName} (SKU: ${productSku})</p>
                    <hr />
                    <p><strong>Name:</strong> ${title} ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${telephone}</p>
                    <p><strong>Topic:</strong> ${topic}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `;
                break;
        }

        const { data, error } = await resend.emails.send({
            from: 'House of Almas <noreply@houseofalmas.co>',
            to: ['houseofalmas@hotmail.com'],
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
