import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    console.log('API KEY:', process.env.OPENAI_API_KEY?.slice(0, 10))
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemPrompt = `Bạn là trợ lý AI của shop thời trang MAISON. Nhiệm vụ của bạn là hỗ trợ khách hàng giải đáp các câu hỏi chung về shop như: chính sách đổi trả, thời gian giao hàng, chất liệu sản phẩm, hướng dẫn chọn size, thông tin liên hệ, chương trình khuyến mãi. Luôn trả lời thân thiện, ngắn gọn, bằng tiếng Việt. Nếu không biết thông tin cụ thể, hãy hướng dẫn khách liên hệ hotline hoặc email shop.`

    const response = await fetch('https://gate.vitexa.app/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json({ error: `AI service error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
