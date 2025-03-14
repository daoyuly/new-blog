---
title: 软件设计的哲学 - ch6
date: 2021-02-6
tags: 软件设计的哲学 软件开发 方法论
abbrlink: 40619
---

# 第 6 章 通用模块更深入

> Chapter 6 General-Purpose Modules are Deeper

One of the most common decisions that you will face when designing a new module is whether to implement it in a general-purpose or special-purpose fashion. Some might argue that you should take a general-purpose approach, in which you implement a mechanism that can be used to address a broad range of problems, not just the ones that are important today. In this case, the new mechanism may find unanticipated uses in the future, thereby saving time. The general-purpose approach seems consistent with the investment mindset discussed in Chapter 3, where you spend a bit more time up front to save time later on.

> 设计新模块时，您将面临的最普遍的决定之一就是以通用还是专用方式实现它。有人可能会争辩说，您应该采用通用方法，在这种方法中，您将实现一种可用于解决广泛问题的机制，而不仅是当今重要的问题。在这种情况下，新机制可能会在将来发现意外用途，从而节省时间。通用方法似乎与第 3 章中讨论的投资思路一致，在这里您花了更多时间在前面，以节省以后的时间。

On the other hand, we know that it’s hard to predict the future needs of a software system, so a general-purpose solution might include facilities that are never actually needed. Furthermore, if you implement something that is too general-purpose, it might not do a good job of solving the particular problem you have today. As a result, some might argue that it’s better to focus on today’s needs, building just what you know you need, and specializing it for the way you plan to use it today. If you take the special-purpose approach and discover additional uses later, you can always refactor it to make it general-purpose. The special-purpose approach seems consistent with an incremental approach to software development.

> 另一方面，我们知道很难预测软件系统的未来需求，因此通用解决方案可能包含从未真正需要的功能。此外，如果您实现的东西过于通用，那么可能无法很好地解决您今天遇到的特定问题。结果，有些人可能会争辩说，最好只关注当今的需求，构建您所知道的需求，并针对您今天打算使用的方式进行专门化处理。如果您采用特殊用途的方法并在以后发现更多用途，则始终可以对其进行重构以使其通用。专用方法似乎与软件开发的增量方法一致。

## 6.1 Make classes somewhat general-purpose 使类变得通用

In my experience, the sweet spot is to implement new modules in a somewhat general-purpose fashion. The phrase “somewhat general-purpose” means that the module’s functionality should reflect your current needs, but its interface should not. Instead, the interface should be general enough to support multiple uses. The interface should be easy to use for today’s needs without being tied specifically to them. The word “somewhat” is important: don’t get carried away and build something so general-purpose that it is difficult to use for your current needs.

> 以我的经验，最有效的方法是以某种通用的方式实现新模块。短语“有点通用”表示该模块的功能应反映您当前的需求，但其接口则不应。相反，该接口应该足够通用以支持多种用途。该界面应易于使用，以满足当今的需求，而不必专门与它们联系在一起。“有点”这个词很重要：不要被带走并建造通用的东西，以致于很难满足当前的需求。

The most important (and perhaps surprising) benefit of the general-purpose approach is that it results in simpler and deeper interfaces than a special-purpose approach. The general-purpose approach can also save you time in the future, if you reuse the class for other purposes. However, even if the module is only used for its original purpose, the general-purpose approach is still better because of its simplicity.

> 通用方法最重要的（也许是令人惊讶的）好处是，与专用方法相比，它导致更简单，更深入的界面。如果您将该类用于其他目的，则通用方法还可以节省将来的时间。但是，即使该模块仅用于其原始用途，由于其简单性，通用方法仍然更好。

## 6.2 Example: storing text for an editor 示例：为编辑器存储文本

Let’s consider an example from a software design class in which students were asked to build simple GUI text editors. The editors had to display a file and allow users to point, click, and type to edit the file. The editors had to support multiple simultaneous views of the same file in different windows; they also had to support multi-level undo and redo for modifications to the file.

> 让我们考虑一个软件设计课程的示例，其中要求学生构建简单的 GUI 文本编辑器。编辑器必须显示一个文件，并允许用户指向，单击并键入以编辑该文件。编辑者必须在不同的窗口中支持同一文件的多个同时视图。他们还必须支持多级撤消和重做以修改文件。

Each of the student projects included a class that managed the underlying text of the file. The text classes typically provided methods for loading a file into memory, reading and modifying the text of the file, and writing the modified text back to a file.

> 每个学生项目都包括一个管理文件的基础文本的类。文本类通常提供以下方法：将文件加载到内存，读取和修改文件的文本以及将修改后的文本写回到文件。

Many of the student teams implemented special-purpose APIs for the text class. They knew that the class was going to be used in an interactive editor, so they thought about the features that the editor had to provide and tailored the API of the text class to those specific features. For example, if a user of the editor typed the backspace key, the editor deleted the character immediately to the left of the cursor; if the user typed the delete key, the editor deleted the character immediately to the right of the cursor. Knowing this, some of the teams created one method in the text class to support each of these specific features:

> 许多学生团队为文本课实现了专用的 API。他们知道该类将在交互式编辑器中使用，因此他们考虑了编辑器必须提供的功能，并针对这些特定功能定制了文本类的 API。例如，如果编辑者的用户键入了退格键，则编辑者会立即删除光标左侧的字符；如果用户键入删除键，则编辑器立即删除光标右侧的字符。知道这一点后，一些团队在文本类中创建了一个方法来支持以下每个特定功能：

```java
void backspace(Cursor cursor);

void delete(Cursor cursor);
```

Each of these methods takes the cursor position as its argument; a special type Cursor represents this position. The editor also had to support a selection that could be copied or deleted. The students handled this by defining a Selection class and passing an object of this class to the text class during deletions:

> 这些方法中的每一个都以光标位置作为参数。特殊类型的光标表示此位置。编辑器还必须支持可以复制或删除的选择。学生通过定义选择类并在删除过程中将该类的对象传递给文本类来解决此问题：

```java
void deleteSelection(Selection selection);
```

The students probably thought that it would be easier to implement the user interface if the methods of the text class corresponded to the features visible to users. In reality, however, this specialization provided little benefit for the user interface code, and it created a high cognitive load for developers working on either the user interface or the text class. The text class ended up with a large number of shallow methods, each of which was only suitable for one user interface operation. Many of the methods, such as delete, were only invoked in a single place. As a result, a developer working on the user interface had to learn about a large number of methods for the text class.

> 学生们可能认为，如果文本类的方法与用户可见的功能相对应，则将更易于实现用户界面。但是，实际上，这种专业化对用户界面代码几乎没有好处，并且为使用用户界面或文本类的开发人员带来了很高的认知负担。文本类以大量浅层方法结束，每种浅层方法仅适用于一个用户界面操作。许多方法（例如 delete）仅在单个位置调用。结果，在用户界面上工作的开发人员必须学习大量有关文本类的方法。

This approach created information leakage between the user interface and the text class. Abstractions related to the user interface, such as the selection or the backspace key, were reflected in the text class; this increased the cognitive load for developers working on the text class. Each new user interface operation required a new method to be defined in the text class, so a developer working on the user interface was likely to end up working on the text class as well. One of the goals in class design is to allow each class to be developed independently, but the specialized approach tied the user interface and text classes together.

> 这种方法在用户界面和文本类之间造成了信息泄漏。与用户界面有关的抽象（例如选择或退格键）反映在文本类中；这增加了从事文本课的开发人员的认知负担。每个新的用户界面操作都需要在文本类中定义一个新方法，因此使用该用户界面的开发人员也可能最终也要使用该文本类。类设计的目标之一是允许每个类独立开发，但是专用方法将用户界面和文本类联系在一起。

## 6.3 A more general-purpose API 更通用的 API

A better approach is to make the text class more generic. Its API should be defined only in terms of basic text features, without reflecting the higher-level operations that will be implemented with it. For example, only two methods are needed for modifying text:

> 更好的方法是使文本类更通用。仅应根据基本文本功能定义其 API，而不应反映将用其实现的更高级别的操作。例如，只需两种方法即可修改文本：

```java
void insert(Position position, String newText);

void delete(Position start, Position end);
```

The first method inserts an arbitrary string at an arbitrary position within the text, and the second method deletes all of the characters at positions greater than or equal to start but less than end. This API also uses a more generic type Position instead of Cursor, which reflects a specific user interface. The text class should also provide general-purpose facilities for manipulating positions within the text, such as the following:

> 第一种方法在文本内的任意位置插入任意字符串，第二种方法删除大于或等于开始但小于结束的位置处的所有字符。此 API 还使用了更通用的 Position 类型来代替 Cursor，它反映了特定的用户界面。文本类还应该提供用于操纵文本中位置的通用工具，例如：

```java
Position changePosition(Position position, int numChars);
```

This method returns a new position that is a given number of characters away from a given position. If the numChars argument is positive, the new position is later in the file than position; if numChars is negative, the new position is before position. The method automatically skips to the next or previous line when necessary. With these methods, the delete key can be implemented with the following code (assuming the cursor variable holds the current cursor position):

> 此方法返回一个新位置，该位置与给定位置相距给定字符数。如果 numChars 参数为正，则新位置在文件中比位置晚；如果 numChars 为负，则新位置在位置之前。必要时，该方法会自动跳到下一行或上一行。使用这些方法，可以使用以下代码来实现删除键（假定 cursor 变量保留当前光标的位置）：

```java
text.delete(cursor, text.changePosition(cursor, 1));
```

Similarly, the backspace key can be implemented as follows:

> 同样，可以按以下方式实现退格键：

```java
text.delete(text.changePosition(cursor, -1), cursor);
```

With the general-purpose text API, the code to implement user interface functions such as delete and backspace is a bit longer than with the original approach using a specialized text API. However, the new code is more obvious than the old code. A developer working in the user interface module probably cares about which characters are deleted by the backspace key. With the new code, this is obvious. With the old code, the developer had to go to the text class and read the documentation and/or code of the backspace method to verify the behavior. Furthermore, the general-purpose approach has less code overall than the specialized approach, since it replaces a large number of special-purpose methods in the text class with a smaller number of general-purpose ones.

> 使用通用文本 API，实现用户界面功能（如删除和退格）的代码比使用专用文本 API 的原始方法要长一些。但是，新代码比旧代码更明显。在用户界面模块中工作的开发人员可能会关心由 Backspace 键删除哪些字符。使用新代码，这是显而易见的。使用旧代码，开发人员必须转到文本类并阅读退格方法的文档和/或代码以验证行为。此外，通用方法总体上比专用方法具有更少的代码，因为它用较少数量的通用方法代替了文本类中的大量专用方法。

A text class implemented with the general-purpose interface could potentially be used for other purposes besides an interactive editor. As one example, suppose you were building an application that modified a specified file by replacing all occurrences of a particular string with another string. Methods from the specialized text class, such as backspace and delete, would have little value for this application. However, the general-purpose text class would already have most of the functionality needed for the new application. All that is missing is a method to search for the next occurrence of a given string, such as this:

> 使用通用接口实现的文本类除交互式编辑器外，还可以用于其他目的。作为一个示例，假设您正在构建一个应用程序，该应用程序通过将所有出现的特定字符串替换为另一个字符串来修改指定文件。专用文本类中的方法（例如，退格键和 Delete）对于此应用程序几乎没有价值。但是，通用文本类已经具有新应用程序所需的大多数功能。缺少的只是一种搜索给定字符串的下一个匹配项的方法，例如：

```java
Position findNext(Position start, String string);
```

Of course, an interactive text editor is likely to have a mechanism for searching and replacing, in which case the text class would already include this method.

> 当然，交互式文本编辑器可能具有搜索和替换的机制，在这种情况下，文本类将已经包含此方法。

## 6.4 Generality leads to better information hiding 通用性可以更好地隐藏信息

The general-purpose approach provides a cleaner separation between the text and user interface classes, which results in better information hiding. The text class need not be aware of specifics of the user interface, such as how the backspace key is handled; these details are now encapsulated in the user interface class. New user interface features can be added without creating new supporting functions in the text class. The general-purpose interface also reduces cognitive load: a developer working on the user interface only needs to learn a few simple methods, which can be reused for a variety of purposes.

> 通用方法在文本和用户界面类之间提供了更清晰的分隔，从而可以更好地隐藏信息。文本类不需要知道用户界面的详细信息，例如如何处理退格键。这些细节现在封装在用户界面类中。可以添加新的用户界面功能，而无需在文本类中创建新的支持功能。通用界面还减轻了认知负担：使用用户界面的开发人员只需要学习一些简单的方法，就可以将其重复用于各种目的。

The backspace method in the original version of the text class was a false abstraction. It purported to hide information about which characters are deleted, but the user interface module really needs to know this; user interface developers are likely to read the code of the backspace method in order to confirm its precise behavior. Putting the method in the text class just makes it harder for user interface developers to get the information they need. One of the most important elements of software design is determining who needs to know what, and when. When the details are important, it is better to make them explicit and as obvious as possible, such as the revised implementation of the backspace operation. Hiding this information behind an interface just creates obscurity.

> 文本类原始版本中的 backspace 方法是错误的抽象。它旨在隐藏有关删除哪些字符的信息，但是用户界面模块确实需要知道这一点。用户界面开发人员可能会阅读退格方法的代码，以确认其精确的行为。将方法放在文本类中只会使用户界面开发人员更难获得所需的信息。软件设计最重要的元素之一就是确定谁需要知道什么以及何时知道。当细节很重要时，最好使它们明确且尽可能明显，例如修订的 Backspace 操作实现。将这些信息隐藏在界面后面只会产生晦涩感。

## 6.5 Questions to ask yourself 问自己的问题

It is easier to recognize a clean general-purpose class design than it is to create one. Here are some questions you can ask yourself, which will help you to find the right balance between general-purpose and special-purpose for an interface.

> 识别干净的通用类设计要比创建一个简单。您可以问自己一些问题，这将帮助您在接口的通用和专用之间找到适当的平衡。

What is the simplest interface that will cover all my current needs? If you reduce the number of methods in an API without reducing its overall capabilities, then you are probably creating more general-purpose methods. The special-purpose text API had at least three methods for deleting text: backspace, delete, and deleteSelection. The more general-purpose API had only one method for deleting text, which served all three purposes. Reducing the number of methods makes sense only as long as the API for each individual method stays simple; if you have to introduce lots of additional arguments in order to reduce the number of methods, then you may not really be simplifying things.

> 满足我当前所有需求的最简单的界面是什么？如果减少 API 中的方法数量而不降低其整体功能，则可能正在创建更多通用的方法。专用文本 API 至少具有三种删除文本的方法：退格，删除和 deleteSelection。通用性更强的 API 只有一种删除文本的方法，可同时满足所有三个目的。仅在每种方法的 API 保持简单的前提下，减少方法的数量才有意义。如果您必须引入许多其他参数以减少方法数量，那么您可能并没有真正简化事情。

In how many situations will this method be used? If a method is designed for one particular use, such as the backspace method, that is a red flag that it may be too special-purpose. See if you can replace several special-purpose methods with a single general-purpose method.

> 在多少情况下会使用此方法？如果一种方法是为特定用途而设计的，例如退格方法，那是一个危险信号，它可能太特殊了。看看是否可以用一个通用方法替换几种专用方法。

Is this API easy to use for my current needs? This question can help you to determine when you have gone too far in making an API simple and general-purpose. If you have to write a lot of additional code to use a class for your current purpose, that’s a red flag that the interface doesn’t provide the right functionality. For example, one approach for the text class would be to design it around single-character operations: insert inserts a single character and delete deletes a single character. This API is both simple and general-purpose. However, it would not be particularly easy to use for a text editor: higher-level code would contain lots of loops to insert or delete ranges of characters. The single-character approach would also be inefficient for large operations. Thus it’s better for the text class to have built-in support for operations on ranges of characters.

> 这个 API 是否易于使用以满足我当前的需求？这个问题可以帮助您确定何时使 API 变得简单而通用。如果您必须编写许多其他代码才能将类用于当前用途，那么这是一个危险信号，即该接口未提供正确的功能。例如，针对文本类的一种方法是围绕单字符操作进行设计：insert 插入单个字符，而 delete 删除单个字符。该 API 既简单又通用。但是，对于文本编辑器来说并不是特别容易使用：更高级别的代码将包含许多循环，用于插入或删除字符范围。单字符方法对于大型操作也将是低效的。

## 6.6 Conclusion 结论

General-purpose interfaces have many advantages over special-purpose ones. They tend to be simpler, with fewer methods that are deeper. They also provide a cleaner separation between classes, whereas special-purpose interfaces tend to leak information between classes. Making your modules somewhat general-purpose is one of the best ways to reduce overall system complexity.

> 通用接口比专用接口具有许多优点。它们往往更简单，使用的方法更少。它们还提供了类之间的更清晰的分隔，而专用接口则倾向于在类之间泄漏信息。使模块具有某种通用性是降低整体系统复杂性的最佳方法之一。
