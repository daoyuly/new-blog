---
title: 'c#读写Excel文件'
tags: 'c#'
abbrlink: 18224
date: 2008-02-04 10:28:00
---


近日遇到这样的一个程序需求：把sql server2005 数据库的数据表导入到excel文件中，整理出来和大家一起分析讨论。

完成这个功能需要的几个集合和对象：Application、Workbooks、Workbook、Worksheets还有Worksheet和Range。Application创建Excel应用，Workbooks打开Excel文档，Workbook获得Excel文档工作薄，Worksheets操作工作表集合，Worksheet获得单个工作表。.net支持用C#操作操作这些对象。

关于Excel编程的其他细节请参阅Excel VBA帮助。

1、 添加应用excel.dll和office.dll （常用的2种方法）

A 、添加引Microsoft.Excel.x.0.Object.Library，Microsoft.Office.x.0.Object.Library

引用的Office组建版本是个敏感问题，不同版本之间有细微差别，需要分别处理。

建议安装正版OFFICE,而且版本在11.0以上(Office2003以上)。使用这种方式时在程序里使用的命名空间是：using Microsoft.Office.Interop.Excel;using Microsoft.Office.Core;

B、添加引用Excel.dll,office.dll。注意：注意在MS office 2003以下的版本中，可能找不到Excel.dll,但是要在Visual C＃中使用非受管代码的COM组件，就必须把它们转换成受管代码的类库。所以在用Visual C＃调用Excel表格之前，必须完成从COM组件的非受管代码到受管代码的类库的转换。具体方法如下： tlbimp /out:excel.dll "C:/Program Files/Microsoft Office/OFFICE11/EXCEL.EXE" 

这样就得到了execl.dll和office.dll了

使用这种方式时在程序里使用的命名空间是：using Excel；

我在示例程序中使用第二种。使用两种引用后，语言的实现上略有不同。

2、 将数据表中的数据导出到excel文件中。

A、获取要导出的数据表数据。这个不属于我们今天的话题，我们暂且不去关注。

   B、新建一个excel文件。
      首先建立一个Execl应用，然后建立Workbooks，Workbook，Worksheets，Worksheet实例。示例代码如下：
      ```c#
       System.Reflection.Missing miss = System.Reflection.Missing.Value;
       Excel.ApplicationClass m_Excel = new Excel.ApplicationClass();
       m_Excel.Visible = false;
        Excel.Workbooks m_Books = (Excel.Workbooks)m_Excel.Workbooks;
        Excel.Workbook m_Book = (Excel.Workbook)(m_Books.Add(miss));
        Excel.Worksheet m_Sheet = (Excel.Worksheet)m_Book.ActiveSheet;
        Excel.Range ER = null;
      ```
        其中Excel.Range  代表某一单元格、某一行、某一列、某一选定区域（该选定区域可包含一个或若干连续单元格区域）或者某一三维区域。
C、根据表结构建立excel模板。
    建立模板的过程就是操作execl的过程。
    假设我们要导出的数据表有两列分别是编号，姓名。exel模板需要有列标题。
    （1）我们要在工作簿的sheet1的第一行第一列和第二列写入编号和姓名。示例代码如下：

    ```c#
    ER = m_Sheet.get_Range((object)"A1", System.Reflection.Missing.Value);
    ER.Value2 = "编号";            
    ER = m_Sheet.get_Range((object)"B1", System.Reflection.Missing.Value);
    ER.Value2 = "姓名";
    ```
 其中 get_Range 方法中以 A1 样式的记号引用单元格和单元格区域。

 通过value2设置单元格的属性。

（2） 设置单元格的格式。示例程序如下：

```c#
range3.Borders.Color = Color.FromArgb(123, 231, 32).ToArgb();
ER.Font.Color = Color.Red.ToArgb();
ER.Font.Name = "Arial";
ER.Font.Size = 90;
ER.Columns.HorizontalAlignment = Excel.Constants.xlCenter;
ER.VerticalAlignment = Excel.Constants.xlCenter;
ER.Interior.Color = Color.FromArgb(192,192,192).ToArgb();
ER.Columns.AutoFit();
```
   
D、写入数据，保存。

     利用循环将DataTable中的数据写到excel文件中。

 m_Book.SaveAs(SavePath, miss, miss, miss, miss, miss, Excel.XlSaveAsAccessMode.xlNoChange, miss, miss, miss, miss, miss);

    
E、关闭资源。

```c#
m_Book.Close(false, miss, miss);
m_Books.Close();
m_Excel.Quit();

System.Runtime.InteropServices.Marshal.ReleaseComObject(ER);
System.Runtime.InteropServices.Marshal.ReleaseComObject(m_Sheet);
System.Runtime.InteropServices.Marshal.ReleaseComObject(m_Book);
System.Runtime.InteropServices.Marshal.ReleaseComObject(m_Books);
System.Runtime.InteropServices.Marshal.ReleaseComObject(m_Excel);
GC.Collect();
```c#

当然这是一个很简单的例子，许多问题还需要各位去研究。
