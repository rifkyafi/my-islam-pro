import { NextResponse } from "next/server";

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
            fetchUrl += `?range=${range}`;
        }
    }

    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            return NextResponse.json(
                {
                    message: "Failed to fetch hadith data"
                },
                {
                    status: response.status
                }
            )
        }
        const data = await response.json();
        return NextResponse.json(data);
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