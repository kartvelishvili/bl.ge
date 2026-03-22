import styles from "./GeorgianWine.module.scss";

export default function Timeline() {
  const timelineData = [
    {
      date: "ძვ.წ. 6000-5000 წწ.",
      text: "ძველი ქართულის რეგიონში არქეოლოგიური გათხრების შედეგად აღმოჩნდა ღვინის ნაწილების უძველესი კვალი, რომელიც 8,000 წლის წინანდელია."
    },
    {
      date: "ძვ.წ. II ათასწლეული - IV ს.",
      text: "ვაზის კულტურამ დღემდე დაცული და ძველი ქართულ კულტურაში მნიშვნელოვან როლს იკავებდა. ღვინის მნიშვნელოვან როლს ასრულებდა რიტუალებსა და მითებში. ღვინო და ვაზის პროდუქციები აქტიურად იყიდებოდა ყველა საექსპორტო გზებზე."
    },
    {
      date: "IV ს.",
      text: "ქრისტიანობის გავრცელებამ ღვინის საკულტო მნიშვნელობას ცხოვრები მოჰფინა. ქვევრის წარმოება მოწესრიგდა გაფართოვდა. ქვევრის რელიგიური და კულტურული ცხოვრების ნაწილად იქცა."
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ქართული ღვინის ისტორია</h1>

      <div className={styles.timeline}>
        <div className={styles.timelineLine} />
        
        {timelineData.map((item, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={`${styles.point} ${styles[`point${['First', 'Second', 'Third'][index]}`]}`} />
            <div className={`${styles.content} ${styles[`content${['First', 'Second', 'Third'][index]}`]}`}>
              <p className={styles.text}>{item.text}</p>
              <span className={styles.date}>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}