export default function StarterQuest({ onStart }: { onStart: () => void }) {
  return <section className="starter-quest-v2">
    <div className="quest-hero"><span>🌱 NHIỆM VỤ ĐẦU TIÊN</span><h2>Gieo hạt kiến thức đầu tiên</h2><p>Biến ghi chú ôn tập thành lộ trình học và thẻ Leitner chỉ trong vài phút.</p><button onClick={onStart}>Tạo tài liệu học tập →</button></div>
    <div className="quest-route"><article><b>01</b><h3>Dán ghi chú</h3><p>Đưa đề cương, công thức hoặc nội dung cần học vào xưởng tạo tài liệu.</p></article><i>→</i><article><b>02</b><h3>AI sắp xếp</h3><p>Nhận lộ trình theo chặng, thẻ truy hồi và câu hỏi phù hợp.</p></article><i>→</i><article><b>03</b><h3>Ôn đều đặn</h3><p>Kiểm duyệt thẻ, ôn theo Leitner và theo dõi tiến bộ mỗi ngày.</p></article></div>
    <div className="quest-tip">💡 Mẹo nhỏ: bắt đầu với một chương hoặc một chủ đề, không cần dán cả quyển sách.</div>
  </section>
}
