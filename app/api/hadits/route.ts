import { NextResponse } from "next/server";
import https from "https";

function fetchWithHttps(url: string): Promise<{ status: number | undefined; data: any }> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}

export async function GET(request: Request) {
    const baseUrl = process.env.NEXT_PUBLIC_HADITS_API_URL;
    if(!baseUrl){
        return NextResponse.json(
            {
                message: " Hadist api url is not defined"
            }
        )
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const range = searchParams.get("range");

    let fetchUrl = `${baseUrl}/books`;
    if (id) {
        fetchUrl = `${baseUrl}/books/${id}`;
        if (range) {
            let formattedRange = range;
            if (/^\d+$/.test(range)) {
                formattedRange = `${range}-${range}`;
            }
            fetchUrl += `?range=${formattedRange}`;
        }
    }

    try {
        const response = await fetchWithHttps(fetchUrl);
        if (response.status !== 200) {
            return NextResponse.json(
                {
                    message: "Failed to fetch hadith data"
                },
                {
                    status: response.status || 500
                }
            )
        }
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching hadith data:", error);
        return NextResponse.json(
            {
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}