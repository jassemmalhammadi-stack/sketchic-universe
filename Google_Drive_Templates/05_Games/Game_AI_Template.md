# 🎮 قالب تصميم الألعاب الكونية (Game Concept & GDScript Template)
> **إرشادات للذكاء الاصطناعي:** استخدم هذا القالب لتأسيس مستوى جديد أو صياغة ميكانيكية اللعب البرمجية القائمة على تبديل الأساليب الشيدر (Shaders) وفيزياء الحركة.

---

## 1. الهيكل العام والميكانيكية (Game Design Summary)
* **اسم اللعبة:** [عنوان اللعبة المقترح]
* **تصنيف اللعبة (Genre):** [مثال: لعبة منصات 2D / مغامرة 3D RPG / رواية بصرية تفاعلية]
* **ميكانيكية التحكم بالأسلوب الفني:** [تبديل شيدر اللاعب / بوابات تغيير أبعاد الرسم]

---

## 2. ميكانيكية تبديل الشيدر والفيزياء (Shader-Swapping Mechanics)
* **فيزياء أسلوب المانجا (Manga Shader Mode):**
  * **الوزن والجاذبية:** [مثال: خفيف الوزن جداً، قفزات عالية، تأثر بالرياح]
  * **شيدر العرض:** [شيدر رسم تخطيطي بالأبيض والأسود مع خطوط خارجية حادة]
* **فيزياء أسلوب اللوحة الزيتية (Oil Shader Mode):**
  * **الوزن والجاذبية:** [مثال: ثقيل جداً، حماية ضد الرياح، قدرة على تدمير الأرضيات الهشة]
  * **شيدر العرض:** [شيدر ألوان زيتية كثيفة وتأثير تسييل الحدود]

---

## 3. كود Godot GDScript المبدئي للتحكم (Initial Script Setup)
```gdscript
extends CharacterBody2D

enum ArtStyle { MANGA, OIL }
var current_style = ArtStyle.MANGA

@export var manga_gravity = 400.0
@export var oil_gravity = 1200.0

func _physics_process(delta):
	# Switch styles on action press
	if Input.is_action_just_pressed("toggle_style"):
		swap_style()
		
	# Apply gravity based on current visual medium physics
	if not is_on_floor():
		if current_style == ArtStyle.MANGA:
			velocity.y += manga_gravity * delta
		else:
			velocity.y += oil_gravity * delta

	move_and_slide()

func swap_style():
	if current_style == ArtStyle.MANGA:
		current_style = ArtStyle.OIL
		# Apply oil shader to sprite and increase mass properties
		$Sprite2D.material.set_shader_parameter("active_style", 1)
	else:
		current_style = ArtStyle.MANGA
		# Apply manga shader and decrease mass
		$Sprite2D.material.set_shader_parameter("active_style", 0)
```
